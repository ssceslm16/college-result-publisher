function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(',');
    headers.forEach((header, index) => {
      obj[header] = currentline[index];
    });
    data.push(obj);
  }
  return data;
}

document.getElementById('resultForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const rollNo = document.getElementById('rollNo').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const resultArea = document.getElementById('resultArea');
  resultArea.textContent = "Loading results...";
  
  fetch('/results.csv')
    .then(response => response.text())
    .then(text => {
      const data = parseCSV(text);
      // Filter for matching rollNo and dob
      const filtered = data.filter(r => r.rollNo === rollNo && r.dob === dob);
      if (filtered.length === 0) {
        resultArea.textContent = "No results found. Please check your Roll Number and Date of Birth.";
        return;
      }

      // Group subjects by student (they have same rollNo & dob)
      const studentName = filtered[0].name;
      let output = `Hello ${studentName},\n\nYour Results:\n`;
      filtered.forEach(item => {
        output += `${item.subject}: ${item.marks} (Grade: ${item.grade})\n`;
      });
      resultArea.textContent = output;
    })
    .catch(err => {
      console.error(err);
      resultArea.textContent = "Error loading results data.";
    });
});