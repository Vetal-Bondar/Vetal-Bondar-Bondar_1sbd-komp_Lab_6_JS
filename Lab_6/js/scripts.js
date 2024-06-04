document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const loadDataButton = document.getElementById('loadDataButton');
    const clearButton = document.getElementById('clearButton');
    const statusMessage = document.getElementById('statusMessage');
    const dataDisplay = document.getElementById('dataDisplay');
    const showTableButton = document.getElementById('showTableButton');
    const hideTableButton = document.getElementById('hideTableButton');
    const dataTable = document.getElementById('dataTable');
    const clearSortButton = document.getElementById('clearSortButton');
    let data = [];
    let sortedColumn = null;
    let sortDirection = 'asc';

    loadDataButton.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (!url) return;

        loadDataButton.disabled = true;
        statusMessage.textContent = 'Завантаження даних...';

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Помилка ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(jsonData => {
                data = jsonData;
                statusMessage.textContent = `Дані формату JSON успішно завантажено. Кількість записів рівна ${data.length}.`;
                dataDisplay.style.display = 'block';
                clearButton.disabled = false;
            })
            .catch(error => {
                statusMessage.textContent = `Не вдалося завантажити дані: ${error.message}`;
            });
    });

    clearButton.addEventListener('click', () => {
        urlInput.value = '';
        statusMessage.textContent = '';
        dataDisplay.style.display = 'none';
        dataTable.style.display = 'none';
        clearSortButton.style.display = 'none';
        loadDataButton.disabled = false;
        clearButton.disabled = true;
    });

    showTableButton.addEventListener('click', () => {
        displayTable();
        dataTable.style.display = 'table';
        clearSortButton.style.display = 'block';
    });

    hideTableButton.addEventListener('click', () => {
        dataDisplay.style.display = 'none';
        dataTable.style.display = 'none';
        clearSortButton.style.display = 'none';
        loadDataButton.disabled = false;
        clearButton.disabled = true;
    });

    function displayTable() {
        const tbody = dataTable.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.username}</td>
                <td>${item.phone}</td>
                <td>${item.website}</td>
            `;
            tbody.appendChild(row);
        });
    }

    dataTable.querySelectorAll('th').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortTable(column);
        });
    });

    function sortTable(column) {
        if (sortedColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortedColumn = column;
            sortDirection = 'asc';
        }

        data.sort((a, b) => {
            if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        displayTable();
        dataTable.querySelectorAll('th').forEach(th => th.classList.remove('sorted', 'asc', 'desc'));
        const sortedHeader = document.querySelector(`th[data-column="${column}"]`);
        sortedHeader.classList.add('sorted', sortDirection);
    }

    clearSortButton.addEventListener('click', () => {
        sortedColumn = null;
        sortDirection = 'asc';
        displayTable();
        dataTable.querySelectorAll('th').forEach(th => th.classList.remove('sorted', 'asc', 'desc'));
    });
});
