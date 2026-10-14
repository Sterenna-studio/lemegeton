"""Vérifie la cohérence des fichiers du canon (canon/*.json)."""
import json
import re
import sys
from pathlib import Path

CANON = Path(__file__).resolve().parent.parent / "canon"
STATUSES = {"aligned", "mapped", "own", "reference"}
# Ce dépôt est public : aucune trace d'infrastructure privée.
FORBIDDEN = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b|localhost|\.local\b|\b[A-Za-z]:\\|token", re.I)


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    errors = []
    emotions = json.loads((CANON / "emotions.json").read_text(encoding="utf-8"))
    ids = [e["id"] for e in emotions["emotions"]]
    if len(ids) != len(set(ids)):
        errors.append("emotions.json : identifiants en double")
    for e in emotions["emotions"]:
        if e["id"] != e["id"].lower() or not e["label"].get("fr") or not e["label"].get("en"):
            errors.append(f"emotions.json : {e['id']} mal formée")
    for key in ("default", "idle"):
        if emotions[key] not in ids:
            errors.append(f"emotions.json : {key} = {emotions[key]} inconnue")
    for name, table in emotions["triggers"].items():
        if not isinstance(table, dict):
            continue
        for event, value in table.items():
            if event in ("source", "description") or " " in value:
                continue
            if value not in ids:
                errors.append(f"emotions.json : déclencheur {name}/{event} → {value} inconnue")

    registry = json.loads((CANON / "apparitions.json").read_text(encoding="utf-8"))
    repos = [p["repo"] for p in registry["projects"]]
    if len(repos) != len(set(repos)):
        errors.append("apparitions.json : dépôts en double")
    for p in registry["projects"]:
        if p["canon_status"] not in STATUSES:
            errors.append(f"apparitions.json : {p['repo']} statut {p['canon_status']} inconnu")
        if p["visibility"] not in ("public", "private"):
            errors.append(f"apparitions.json : {p['repo']} visibilité inconnue")

    for path in sorted(CANON.iterdir()):
        for match in FORBIDDEN.finditer(path.read_text(encoding="utf-8")):
            errors.append(f"{path.name} : « {match.group()} » ressemble à une donnée privée")

    for line in errors:
        print(line)
    print(f"{len(ids)} émotions, {len(repos)} projets : {'KO' if errors else 'OK'}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
