import { Lead } from '../types/lead';

// Properly escape a CSV cell value
const escapeCSVCell = (value: string): string => {
  // If value contains commas, quotes, or newlines, wrap in quotes and escape inner quotes
  const stringValue = String(value ?? '');
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
};

export const exportLeadsToCSV = (leads: Lead[]): void => {
  if (!leads || leads.length === 0) {
    alert('No leads to export.');
    return;
  }

  // Basic headers
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];

  // Map data to rows
  const rows = leads.map((lead) => {
    return [
      lead.name || '',
      lead.email || '',
      lead.status || '',
      lead.source || '',
      new Date(lead.createdAt).toLocaleDateString() || ''
    ];
  });

  // Simple CSV formatting
  // Quotes values only if they contain commas, quotes, or newlines
  const formatCell = (value: string) => {
    const stringVal = String(value);
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  // Add BOM (\uFEFF) so Excel forces UTF-8 encoding
  const csvContent = '\uFEFF' + [
    headers.map(formatCell).join(','),
    ...rows.map(row => row.map(formatCell).join(','))
  ].join('\r\n'); // Use CRLF line endings for Windows/Excel compatibility

  // Create Blob and trigger download (Excel prefers this MIME type for CSVs sometimes, but text/csv is standard)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_export_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  // Delay revocation to ensure the browser has time to start the download with the correct filename
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};
