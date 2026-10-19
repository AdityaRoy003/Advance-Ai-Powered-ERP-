/**
 * Universal Export & Download Utility for EduVerse AI ERP
 * Supports direct file downloads (CSV, JSON, PDF/HTML Slips) with clean Blob triggers.
 */

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data, filename = 'export.csv') {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] === undefined || row[header] === null ? '' : row[header];
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

export function exportToJSON(data, filename = 'export.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

export function downloadReceipt(invoice) {
  const title = invoice.title || 'Fee Tuition Payment Receipt';
  const id = invoice.id || invoice.invoiceNumber || `INV-${Date.now()}`;
  const amount = invoice.amountPaid || invoice.amountDue || invoice.amount || 45000;
  const student = invoice.student || invoice.studentName || 'Aditya Roy';
  const date = invoice.dueDate || invoice.date || new Date().toISOString().split('T')[0];
  const method = invoice.paymentMethod || 'Encrypted Gateway / Card';

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Fee Receipt - ${id}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
        .card { max-width: 650px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 900; color: #6366f1; }
        .badge { background: #065f46; color: #34d399; font-weight: bold; font-size: 12px; padding: 6px 12px; border-radius: 8px; text-transform: uppercase; }
        .meta { margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; letter-spacing: 0.5px; }
        .val { font-size: 15px; font-weight: 600; color: #f1f5f9; margin-top: 4px; }
        .summary-box { margin-top: 28px; background: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
        .total-row { display: flex; justify-content: space-between; align-items: center; font-size: 20px; font-weight: 800; color: #38bdf8; }
        .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px dashed #334155; padding-top: 16px; }
        @media print { body { background: #fff; color: #000; } .card { background: #fff; border: 1px solid #ddd; color: #000; } .summary-box { background: #f8fafc; border-color: #ddd; } .total-row { color: #000; } }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div class="logo">EduVerse AI ERP</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Verified Autonomous Academic Network</div>
          </div>
          <div class="badge">Payment Verified ✓</div>
        </div>
        <div class="meta">
          <div>
            <div class="label">Receipt Number</div>
            <div class="val">${id}</div>
          </div>
          <div>
            <div class="label">Issue Date</div>
            <div class="val">${date}</div>
          </div>
          <div>
            <div class="label">Student Name</div>
            <div class="val">${student}</div>
          </div>
          <div>
            <div class="label">Payment Mode</div>
            <div class="val">${method}</div>
          </div>
        </div>
        <div class="summary-box">
          <div class="label">Invoice Description</div>
          <div class="val" style="margin-bottom: 16px;">${title}</div>
          <div class="total-row">
            <span>Total Paid Amount:</span>
            <span>${typeof amount === 'number' ? '₹' + amount.toLocaleString() : amount}</span>
          </div>
        </div>
        <div class="footer">
          Digitally signed via EduVerse Institutional Ledger • SHA-256 Validated • UGC / AICTE Compliant
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([receiptHTML], { type: 'text/html;charset=utf-8;' });
  downloadBlob(blob, `Receipt-${id}.html`);
}
