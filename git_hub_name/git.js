function displayRepositories(repositories) {
    const repoContainer = $('#repositories');

    repositories.forEach(repo => {
        const topics = repo.topics ? repo.topics.join(', ') : '';
        const languages = repo.languages_url ? getLanguages(repo.languages_url) : [];
        const languageBoxes = languages.map(lang => `<div class="language-box">${lang}</div>`).join('');
        const card = `
        <div class="col">
            <div class="repo-card">
                <h5 class="main-headline text-primary">${repo.name}</h5>
                <p>${repo.description || 'No description available.'}</p>
                ${languageBoxes}
            </div>
        </div>
    `;
        repoContainer.append(card);
    });
}


function getLanguages(languagesUrl) {
    let languages = [];

    $.ajax({
        url: languagesUrl,
        async: false,
        success: function (data) {
            languages = Object.keys(data);
        }
    });

    return languages;
}
function displayPagination(username, perPage) {
    const paginationContainer = $('#pagination');
    const totalPages = Math.ceil(60 / perPage); // Assuming a maximum of 10 repositories

    let paginationHTML = `
    <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
            <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>
`;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="getRepositoriesPage('${username}', ${perPage}, ${i})">${i}</a></li>`;
    }

    paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="getRepositoriesPage('${username}', ${perPage}, 2)">Next</a>
            </li>
        </ul>
    </nav>
`;

    paginationContainer.html(paginationHTML);
}

function getRepositories() {
    const username = $('#username').val();
    const perPage = 6; // Set the number of repositories per page to 6
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}`;

    // Show loader
    $('#loader').show();

    // Clear existing content
    $('#repositories').html('');

    // Make API call
    $.get(apiUrl, function (data, status) {
        // Hide loader
        $('#loader').hide();

        // Display repositories
        displayRepositories(data);

        // Display pagination
        displayPagination(username, perPage);
    });

    // Display user profile link
    const userProfileLink = `<a href="https://github.com/${username}" class="no-underline Link--primary">${username}</a>`;
    $('#user-profile').html(userProfileLink);
}

// Add a div for user profile link in your HTML
// <div id="user-profile"></div>



function getRepositoriesPage(username, perPage, page) {
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;

    // Show loader
    $('#loader').show();

    // Clear existing content
    $('#repositories').html('');

    // Make API call
    $.get(apiUrl, function (data, status) {
        // Hide loader
        $('#loader').hide();

        // Display repositories
        displayRepositories(data);
    });
}