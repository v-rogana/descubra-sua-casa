"""
Arena das Casas - Extrai KPIs do Hamilton e grava no Supabase
=============================================================
Roda via GitHub Actions (semanal) ou manualmente.

Variáveis de ambiente necessárias:
    HAMILTON_DB_URL      - Connection string PostgreSQL (Neon)
    SUPABASE_URL         - URL do projeto Supabase
    SUPABASE_SERVICE_KEY - Service role key do Supabase
"""

import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from supabase import create_client

# ── Configuração ──────────────────────────────────────────────────────────────

DATABASE_URL = os.environ["HAMILTON_DB_URL"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

NUCLEO_MAP = {
    "Prisma": "prisma",
    "Macondo": "macondo",
    "Marmoris": "marmoris",
}

CAPTACOES_IGNORAR = [13, 46]

HOUSE_INFO = {
    "prisma": {
        "name": "Prisma",
        "leader": "Diogo",
        "sensibility": "TCC e Comportamentais",
        "motto": "Decompor a complexidade em clareza",
    },
    "macondo": {
        "name": "Macondo",
        "leader": "Flávia",
        "sensibility": "Psicodinâmica",
        "motto": "A magia habita a realidade",
    },
    "marmoris": {
        "name": "Marmoris",
        "leader": "Alice Guedon",
        "sensibility": "Humanista",
        "motto": "O brilho do sol refletido no mar",
    },
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_connection():
    return psycopg2.connect(DATABASE_URL)


def count_months(date_start, date_end):
    months = (date_end.year - date_start.year) * 12 + (date_end.month - date_start.month) + 1
    return max(months, 1)


# ── Funções de Extração ──────────────────────────────────────────────────────

def get_house_basics(cur):
    cur.execute("""
        SELECT
            n.nucleo AS casa,
            COUNT(DISTINCT t.pk_terapeuta) AS therapists_count,
            COUNT(DISTINCT p.pk_paciente) AS active_patients
        FROM terapeutas t
        JOIN nucleos n ON t.fk_nucleo = n.pk_nucleo
        LEFT JOIN pacientes p ON p.fk_terapeuta = t.pk_terapeuta
        WHERE t.is_active = true
          AND n.nucleo IN ('Prisma', 'Macondo', 'Marmoris')
        GROUP BY n.nucleo
    """)
    results = {}
    for row in cur.fetchall():
        key = NUCLEO_MAP.get(row["casa"])
        if key:
            results[key] = {
                "therapists_count": row["therapists_count"],
                "active_patients": row["active_patients"] or 0,
            }
    return results


def get_adimplencia(cur, date_start, date_end):
    num_months = count_months(date_start, date_end)
    captacoes_placeholder = ','.join(str(c) for c in CAPTACOES_IGNORAR)

    cur.execute(f"""
        WITH pacientes_ativos AS (
            SELECT
                n.nucleo AS casa,
                COUNT(DISTINCT p.pk_paciente) AS total_pacientes
            FROM pacientes p
            JOIN terapeutas t ON p.fk_terapeuta = t.pk_terapeuta
            JOIN nucleos n ON t.fk_nucleo = n.pk_nucleo
            WHERE t.is_active = true
              AND p.fk_captacao NOT IN ({captacoes_placeholder})
              AND n.nucleo IN ('Prisma', 'Macondo', 'Marmoris')
            GROUP BY n.nucleo
        ),
        pagamentos_periodo AS (
            SELECT
                n.nucleo AS casa,
                COUNT(DISTINCT pg.pk_pagamento) AS total_pagamentos
            FROM pagamento pg
            JOIN pacientes p ON pg.fk_paciente_id = p.pk_paciente
            JOIN terapeutas t ON pg.fk_terapeuta_id = t.pk_terapeuta
            JOIN nucleos n ON t.fk_nucleo = n.pk_nucleo
            WHERE pg.dat_pagamento >= %s
              AND pg.dat_pagamento <= %s
              AND p.fk_captacao NOT IN ({captacoes_placeholder})
              AND n.nucleo IN ('Prisma', 'Macondo', 'Marmoris')
            GROUP BY n.nucleo
        )
        SELECT
            pa.casa,
            COALESCE(pp.total_pagamentos, 0) AS pagamentos,
            pa.total_pacientes,
            CASE
                WHEN pa.total_pacientes > 0
                THEN ROUND(
                    (COALESCE(pp.total_pagamentos, 0)::numeric / (pa.total_pacientes * %s)) * 100,
                    1
                )
                ELSE 0
            END AS taxa
        FROM pacientes_ativos pa
        LEFT JOIN pagamentos_periodo pp ON pa.casa = pp.casa
    """, (date_start, date_end, num_months))

    results = {}
    for row in cur.fetchall():
        key = NUCLEO_MAP.get(row["casa"])
        if key:
            results[key] = min(float(row["taxa"]), 100.0)
    return results


def get_sessoes_por_paciente(cur, date_start, date_end):
    cur.execute("""
        SELECT
            n.nucleo AS casa,
            COUNT(c.pk_consulta) AS total_sessoes,
            COUNT(DISTINCT c.fk_paciente) AS pacientes_distintos,
            CASE
                WHEN COUNT(DISTINCT c.fk_paciente) > 0
                THEN ROUND(COUNT(c.pk_consulta)::numeric / COUNT(DISTINCT c.fk_paciente), 1)
                ELSE 0
            END AS media
        FROM consultas c
        JOIN terapeutas t ON c.fk_terapeuta = t.pk_terapeuta
        JOIN nucleos n ON t.fk_nucleo = n.pk_nucleo
        WHERE c.is_realizado = true
          AND c.dat_consulta >= %s
          AND c.dat_consulta <= %s
          AND n.nucleo IN ('Prisma', 'Macondo', 'Marmoris')
        GROUP BY n.nucleo
    """, (date_start, date_end))

    results = {}
    for row in cur.fetchall():
        key = NUCLEO_MAP.get(row["casa"])
        if key:
            results[key] = float(row["media"])
    return results


def get_qualidade(cur, date_start, date_end):
    cur.execute("""
        SELECT
            n.nucleo AS casa,
            ROUND(AVG(a.qualidade_geral)::numeric, 1) AS media_qualidade,
            COUNT(a.pk_avaliacao) AS total_avaliacoes
        FROM "avaliação" a
        JOIN terapeutas t ON a.fk_terapeuta = t.pk_terapeuta
        JOIN nucleos n ON t.fk_nucleo = n.pk_nucleo
        WHERE a.qualidade_geral IS NOT NULL
          AND a.created_at >= %s
          AND a.created_at < (%s::date + interval '1 day')
          AND n.nucleo IN ('Prisma', 'Macondo', 'Marmoris')
        GROUP BY n.nucleo
    """, (date_start, date_end))

    results = {}
    for row in cur.fetchall():
        key = NUCLEO_MAP.get(row["casa"])
        if key:
            results[key] = float(row["media_qualidade"]) if row["media_qualidade"] else 0.0
    return results


def get_comparecimento(cur, date_start, date_end):
    today = date.today()
    effective_end = min(date_end, today)

    cur.execute("""
        SELECT
            n.nucleo AS casa,
            COUNT(CASE WHEN c.is_realizado = true THEN 1 END) AS realizadas,
            COUNT(c.pk_consulta) AS total,
            CASE
                WHEN COUNT(c.pk_consulta) > 0
                THEN ROUND(
                    (COUNT(CASE WHEN c.is_realizado = true THEN 1 END)::numeric / COUNT(c.pk_consulta)) * 100,
                    1
                )
                ELSE 0
            END AS taxa
        FROM consultas c
        JOIN terapeutas t ON c.fk_terapeuta = t.pk_terapeuta
        JOIN nucleos n ON t.fk_nucleo = n.pk_nucleo
        WHERE c.dat_consulta >= %s
          AND c.dat_consulta <= %s
          AND n.nucleo IN ('Prisma', 'Macondo', 'Marmoris')
        GROUP BY n.nucleo
    """, (date_start, effective_end))

    results = {}
    for row in cur.fetchall():
        key = NUCLEO_MAP.get(row["casa"])
        if key:
            results[key] = float(row["taxa"])
    return results


# ── Geração e Upload ─────────────────────────────────────────────────────────

def generate_data():
    print("=" * 60)
    print("ARENA DAS CASAS - Geração de Dados")
    print("=" * 60)

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    today = date.today()
    current_month_start = today.replace(day=1)
    current_month_end = today
    accumulated_start = (today - relativedelta(months=2)).replace(day=1)
    accumulated_end = today

    print(f"\nPeríodo atual: {current_month_start} → {current_month_end}")
    print(f"Acumulado:     {accumulated_start} → {accumulated_end}")

    print("\n[1/5] Dados básicos das Casas...")
    basics = get_house_basics(cur)
    for key, val in basics.items():
        print(f"  {key}: {val['therapists_count']}T, {val['active_patients']}P")

    print("\n[2/5] Adimplência...")
    adimplencia_current = get_adimplencia(cur, current_month_start, current_month_end)
    adimplencia_accum = get_adimplencia(cur, accumulated_start, accumulated_end)

    print("\n[3/5] Sessões por paciente...")
    sessoes_current = get_sessoes_por_paciente(cur, current_month_start, current_month_end)
    sessoes_accum = get_sessoes_por_paciente(cur, accumulated_start, accumulated_end)

    print("\n[4/5] Qualidade da terapia...")
    qualidade_current = get_qualidade(cur, current_month_start, current_month_end)
    qualidade_accum = get_qualidade(cur, accumulated_start, accumulated_end)

    print("\n[5/5] Taxa de comparecimento...")
    comparecimento_current = get_comparecimento(cur, current_month_start, current_month_end)
    comparecimento_accum = get_comparecimento(cur, accumulated_start, accumulated_end)

    cur.close()
    conn.close()

    # ── Montar payload ──
    meses_pt = {
        1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
        5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
        9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
    }

    current_label = f"{meses_pt[today.month]} {today.year}"
    accum_start_label = f"{meses_pt[accumulated_start.month][:3]} {accumulated_start.year}"
    accum_end_label = f"{meses_pt[today.month][:3]} {today.year}"
    accumulated_label = f"{accum_start_label} — {accum_end_label}"

    houses = {}
    for key in ["prisma", "macondo", "marmoris"]:
        houses[key] = {
            **HOUSE_INFO[key],
            "therapists_count": basics.get(key, {}).get("therapists_count", 0),
            "active_patients": basics.get(key, {}).get("active_patients", 0),
        }

    def safe_kpi(data_dict):
        return {
            "prisma": data_dict.get("prisma", 0),
            "macondo": data_dict.get("macondo", 0),
            "marmoris": data_dict.get("marmoris", 0),
        }

    payload = {
        "houses": houses,
        "periods": {
            "current": {
                "label": current_label,
                "kpis": {
                    "adimplencia": safe_kpi(adimplencia_current),
                    "sessoes_paciente": safe_kpi(sessoes_current),
                    "qualidade": safe_kpi(qualidade_current),
                    "comparecimento": safe_kpi(comparecimento_current),
                },
            },
            "accumulated": {
                "label": accumulated_label,
                "kpis": {
                    "adimplencia": safe_kpi(adimplencia_accum),
                    "sessoes_paciente": safe_kpi(sessoes_accum),
                    "qualidade": safe_kpi(qualidade_accum),
                    "comparecimento": safe_kpi(comparecimento_accum),
                },
            },
        },
    }

    # ── Upload para Supabase ──
    print("\nEnviando para Supabase...")
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    sb.table("arena_data").upsert({
        "id": 1,
        "updated_at": datetime.utcnow().isoformat(),
        "data": payload,
    }).execute()

    print("\n" + "=" * 60)
    print("✅ Dados da Arena atualizados no Supabase!")
    print("=" * 60)

    return payload


if __name__ == "__main__":
    generate_data()
