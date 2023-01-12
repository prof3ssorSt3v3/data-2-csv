const APP = {
  data: [],
  init() {
    APP.addListeners();
  },
  addListeners() {
    const form = document.querySelector('#collect form');
    form.addEventListener('submit', APP.saveData);

    document.getElementById('btnExport').addEventListener('click', APP.exportData);

    document.querySelector('table tbody').addEventListener('dblclick', APP.editCell);
  },
  saveData(ev) {
    ev.preventDefault();
    const form = ev.target;
    const formdata = new FormData(form);
    APP.cacheData(formdata);
    APP.buildRow(formdata);
    form.reset();
    document.getElementById('fname').focus();
  },
  cacheData(formdata) {
    APP.data.push(Array.from(formdata.values()));
    console.table(APP.data);
  },
  buildRow(formdata) {
    const tbody = document.querySelector('#display > table > tbody');
    const tr = document.createElement('tr');
    tr.setAttribute('data-row', document.querySelectorAll('tbody tr').length);
    let col = 0;
    for (let entry of formdata.entries()) {
      tr.innerHTML += `<td data-col="${col}" data-name="${entry[0]}">${entry[1]}</td>`;
      col++;
    }
    tbody.append(tr);
  },
  exportData() {
    //insert the header row
    APP.data.unshift(['First Name', 'Last Name', 'Email', 'Username']);
    //convert array to a string with \n at the end
    let str = '';
    APP.data.forEach((row) => {
      str += row
        .map((col) => JSON.stringify(col))
        .join(',')
        .concat('\n');
    });
    //create the file
    let filename = `dataexport.${Date.now()}.csv`;
    let file = new File([str], filename, { type: 'text/csv' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
  },
  editCell(ev) {
    let cell = ev.target.closest('td');
    let row = +cell.parentElement.getAttribute('data-row');
    let col = +cell.getAttribute('data-col');
    if (cell) {
      cell.contentEditable = true;
      let txt = cell.textContent;
      cell.focus();
      cell.addEventListener('keydown', function save(ev) {
        //check for Enter key
        if (ev.key === 'Enter' || ev.code === 'Enter') {
          //disable contentEditable
          cell.contentEditable = false;
          //remove listener
          cell.removeEventListener('keydown', save);
          //update APP.data using the row value
          APP.data[row][col] = cell.textContent;
          //need to match the cell with the column based on row and col
          console.table(APP.data);
        }
      });
    }
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
