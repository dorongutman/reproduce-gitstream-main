
/**
 * @module checkStatusEquals
 * @description Check if the status of a check run for a given commit equals the expected state.
 * @param {string} commitShaOrBranch - The SHA of the commit or branch to get the check status for.
 * @param {string} checkName - The name of the check to get the status for.
 * @param {string} expectedState - The expected state of the check.
 * @param {string} githubOrg - The organization of the repository.
 * @param {string} githubRepo - The name of the repository.
 * @param {string} token - The GitHub token to use for authentication.
 * @param {function} callback - The callback function to call with the result.
 */

const DEBUG = true;

const checkStatusEquals = async (commitShaOrBranch, checkName, expectedState, githubOrg, githubRepo, token, callback) => {
    try {
        let error = null;
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
        return callback('Error fetching check status: ' + exception, null);
    }
};

module.exports = {
    async: true,
    filter: checkStatusEquals,
};