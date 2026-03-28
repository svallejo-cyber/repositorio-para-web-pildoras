#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def iter_demo_files(demo_root: Path):
    for path in sorted(demo_root.rglob('*')):
        if not path.is_file():
            continue
        if path.name == '.DS_Store':
            continue
        yield path


def main() -> int:
    parser = argparse.ArgumentParser(description='Promote demo overrides into live paths.')
    parser.add_argument('--apply', action='store_true', help='Copy demo overrides into live paths.')
    parser.add_argument('--backup-dir', default='.demo-backups', help='Where to place live backups when applying.')
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    demo_root = repo_root / 'demo'
    backup_root = repo_root / args.backup_dir

    files = list(iter_demo_files(demo_root))
    if not files:
        print('No demo files found.')
        return 0

    print('Demo overrides detected:')
    for src in files:
        rel = src.relative_to(demo_root)
        dst = repo_root / rel
        print(f'  {src} -> {dst}')

    if not args.apply:
        print('\nDry run only. Use --apply to promote these files.')
        return 0

    backup_root.mkdir(parents=True, exist_ok=True)
    for src in files:
        rel = src.relative_to(demo_root)
        dst = repo_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists():
            backup = backup_root / rel
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(dst, backup)
        shutil.copy2(src, dst)
        print(f'Promoted: {rel}')

    print(f'\nPromotion complete. Backups stored in {backup_root}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
