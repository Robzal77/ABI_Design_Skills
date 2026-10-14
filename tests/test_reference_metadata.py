import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

class TestReferenceMetadata(unittest.TestCase):
    def test_deck_metadata(self):
        d=json.loads((ROOT/"brand/references/sustainability-cea-brewhub-2026/design-analysis.json").read_text())
        self.assertEqual(d["slideCount"], 24)
        self.assertEqual(d["visibleSlideCount"], 21)
        self.assertEqual(d["hiddenSlideIndices"], [21,22,23])
        self.assertEqual(d["layoutCount"], 49)
        self.assertEqual(sum(len(x["availableLayouts"]) for x in d["layoutFamilies"]), 49)
        self.assertEqual(len(d["patterns"]), 13)
        self.assertEqual(d["theme"]["colors"]["accent1"], "#F5E003")
        self.assertEqual(d["theme"]["colors"]["accent2"], "#E5B611")
        self.assertEqual(d["theme"]["colors"]["accent3"], "#D1A33C")
        self.assertIn("not_committed", d["sourceStatus"])

if __name__=="__main__": unittest.main()
