
/**
 * @module checkStatusEquals
 * @description Check if the status of a check run for a given commit equals the expected state.
 * @param {string} input - The SHA of the commit or branch to get the check status for.
 * @param {string} checkName - The name of the check to get the status for.
 * @param {string} expectedState - The expected state of the check.
 * @param {string} githubOrg - The organization of the repository.
 * @param {string} githubRepo - The name of the repository.
 * @param {string} token - The GitHub token to use for authentication.
 * @example {{ branch.name | checkStatusEquals('my-external-service', 'success', repo.owner, repo.name, env.GITHUB_TOKEN) }}
 * @returns {boolean} Returns true if the check status equals the expected state, false otherwise.
 */

const DEBUG = true;

const checkStatusEquals = async (commitShaOrBranch, checkName, expectedState, githubOrg, githubRepo, token, callback) => {
    return callback(null, false);
    try {
        // GitHub API endpoint for check runs
        const apiUrl = `https://api.github.com/repos/${githubOrg}/${githubRepo}/statuses/${commitShaOrBranch}`;
        
        // Prepare headers with authentication
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'gitStream-plugin'
        };
        
        if (DEBUG) {
            console.log('GitHub API URL:', apiUrl);
        }

        // Add authorization header if token is provided
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Make the API request
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            if (DEBUG) {
                console.log('GitHub API request failed:', response);
            }
            throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (DEBUG) {
            console.log('GitHub API response:', data);
        }
        
        // Find the check run with the specified name
        const checkRun = data.find(check => check.context === checkName);
        
        if (!checkRun) {
            throw new Error('Check not found');
        }

        // Return the status of the check run
        return callback(null, checkRun.state === expectedState);
        
    } catch (exception) {
        return callback('Error checking status: ' + exception, false);
    }
};

module.exports = {
    async: true,
    filter: checkStatusEquals,
};