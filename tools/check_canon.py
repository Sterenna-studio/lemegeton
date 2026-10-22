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

    # Lignée : une seule référence par famille ; copies et portages citent une source connue.
    roles = set(registry.get("lineage_values", {}))
    families = {"emotions", "moods"}
    if set(emotions.get("references", {})) - {"verified"} != families:
        errors.append("emotions.json : « references » doit décrire les familles emotions et moods")
    references = {family: [] for family in families}
    for p in registry["projects"]:
        lin = p.get("lineage")
        if not lin:
            continue
        if lin["family"] not in families or lin["role"] not in roles:
            errors.append(f"apparitions.json : {p['repo']} lignée inconnue ({lin['family']}/{lin['role']})")
            continue
        if lin["role"] == "reference":
            references[lin["family"]].append(p["repo"])
            if lin["from"]:
                errors.append(f"apparitions.json : {p['repo']} est une référence et cite une source")
        elif not lin["from"]:
            errors.append(f"apparitions.json : {p['repo']} ({lin['role']}) doit citer sa source")
        for source in lin["from"]:
            if source not in repos:
                errors.append(f"apparitions.json : {p['repo']} cite une source inconnue : {source}")
    for family, found in references.items():
        if len(found) != 1:
            errors.append(f"apparitions.json : la famille {family} doit avoir une référence, trouvé {found}")
    for vocabulary, moods in emotions.get("references", {}).get("moods", {}).get("vocabularies", {}).items():
        if len(moods) != len(set(moods)):
            errors.append(f"emotions.json : humeurs en double dans {vocabulary}")

    # Table de repli : chaque moteur couvre les émotions du canon avec des humeurs qu'il possède.
    vocabularies = emotions.get("references", {}).get("moods", {}).get("vocabularies", {})
    fallbacks = emotions.get("fallbacks", {}).get("engines", {})
    if set(fallbacks) != set(vocabularies):
        errors.append(f"emotions.json : fallbacks couvre {sorted(fallbacks)}, vocabulaires {sorted(vocabularies)}")
    for name, spec in fallbacks.items():
        if set(spec["moods"]) != set(ids):
            errors.append(f"emotions.json : fallbacks/{name} ne couvre pas exactement les émotions du canon")
        for emotion, mood in spec["moods"].items():
            if mood not in vocabularies.get(name, []):
                errors.append(f"emotions.json : fallbacks/{name} : {emotion} → {mood} absent du vocabulaire {name}")
        for emotion in spec["approximate"]:
            if emotion not in ids:
                errors.append(f"emotions.json : fallbacks/{name} : « approximate » cite {emotion} inconnue")

    for path in sorted(CANON.iterdir()):
        for match in FORBIDDEN.finditer(path.read_text(encoding="utf-8")):
            errors.append(f"{path.name} : « {match.group()} » ressemble à une donnée privée")

    for line in errors:
        print(line)
    print(f"{len(ids)} émotions, {len(repos)} projets : {'KO' if errors else 'OK'}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
