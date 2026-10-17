import contextlib
import importlib.util
import io
import os
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('audit_gt', Path(__file__).with_name('audit-gt.py'))
audit_gt = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit_gt)

class AuditTests(unittest.TestCase):
    def run_audit(self, local, rows, min_rows=1):
        with tempfile.TemporaryDirectory() as directory:
            previous = os.getcwd()
            try:
                os.chdir(directory)
                Path('src/data').mkdir(parents=True)
                Path('src/data/frcc-gtpathways-raw.ts').write_text('"GT-AH1": `' + local + '`')
                Path('official.html').write_text('<h3>Arts and Expression - AH1</h3><table>' + rows + '</table>')
                with contextlib.redirect_stdout(io.StringIO()):
                    return audit_gt.audit('official.html', min_rows=min_rows)
            finally:
                os.chdir(previous)
    def test_normalizes_whitespace_and_category_suffix_only(self):
        result = self.run_audit('ART 1110* | Art Appreciation | 3', '<tr><td>ART 1110*</td><td>Art  Appreciation: GT-AH1</td><td>3</td></tr>')
        self.assertEqual(result['matches'], 1)
        self.assertEqual(result['differences'], [])
    def test_detects_title_credit_and_availability_disagreements(self):
        result = self.run_audit('ART 1110 | Different title | 4', '<tr><td>ART 1110*</td><td>Art Appreciation: GT-AH1</td><td>3</td></tr>')
        self.assertEqual(result['differences'][0]['result'], 'mismatch')
    def test_reports_both_missing_and_extra_rows(self):
        result = self.run_audit('ART 1110 | Art | 3', '<tr><td>ART 1111</td><td>History: GT-AH1</td><td>3</td></tr>')
        self.assertEqual({r['result'] for r in result['differences']}, {'missing-local', 'missing-official'})
    def test_refuses_incomplete_or_duplicate_source_documents(self):
        with self.assertRaises(ValueError):
            self.run_audit('ART 1110 | Art | 3', '', min_rows=200)
        row = '<tr><td>ART 1110</td><td>Art: GT-AH1</td><td>3</td></tr>'
        with self.assertRaisesRegex(ValueError, 'Duplicate official'):
            self.run_audit('ART 1110 | Art | 3', row + row)
    def test_refuses_duplicate_local_transcription(self):
        with self.assertRaisesRegex(ValueError, 'Duplicate local'):
            self.run_audit('ART 1110 | Art | 3\nART 1110 | Art | 3', '<tr><td>ART 1110</td><td>Art: GT-AH1</td><td>3</td></tr>')

if __name__ == '__main__':
    unittest.main()
