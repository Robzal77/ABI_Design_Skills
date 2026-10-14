import json
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import avi

class TestAVI(unittest.TestCase):
    def test_brief(self):
        d=avi.read_brief(Path(__file__).resolve().parents[1]/"examples/brief.json")
        self.assertTrue(d["title"])
    def test_html_escaped(self):
        d={"title":"X","headline":"<script>alert(1)</script>","audience":"Internal","purpose":"Demo","points":["<img src=x>"]}
        w=avi.web(d,avi.palette())
        self.assertNotIn("<script>",w)
        self.assertNotIn("<img src=x>",w)
    def test_svg_valid(self):
        import xml.etree.ElementTree as ET
        d=avi.read_brief(Path(__file__).resolve().parents[1]/"examples/brief.json")
        ET.fromstring(avi.svg(d,avi.palette()))
    def test_powerbi_json(self):
        d=avi.read_brief(Path(__file__).resolve().parents[1]/"examples/brief.json")
        t=json.loads(avi.powerbi(d,avi.palette()))
        self.assertEqual(t["tableAccent"],"#E5B611")
    def test_diagram_contains_steps(self):
        self.assertIn("Brief",avi.diagram({"steps":["Brief","Review"]}))
    def test_public_not_production_approved(self):
        b=json.loads((Path(__file__).resolve().parents[1]/"brand/brand.json").read_text())
        self.assertFalse(b["productionApproved"])

if __name__=="__main__": unittest.main()
