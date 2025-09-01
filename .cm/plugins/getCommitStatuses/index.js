const { Octokit } = require('@octokit/rest');

/**
 * Get CLIENT_PAYLOAD from environment variables
 * @returns {Object} - The client payload object
 */
const getClientPayloadParsed = () => {
  const afterOneParsing = JSON.parse(process.env.CLIENT_PAYLOAD || '{}');

  if (typeof afterOneParsing === 'string') {
    return JSON.parse(afterOneParsing);
  }

  return afterOneParsing;
};

/**
 * Retrieves commit statuses for a commit by fetching status checks from GitHub API
 * Gets commit SHA, repository info, and GitHub token from client payload
 *
 * @function getCommitStatuses
 * @param {*} _ - Unused parameter (context data is retrieved from client payload)
 * @param {Function} callback - Callback function to return results
 * @returns {Array<Object>} - Array of commit status checks with name, status, conclusion, title, completedAt, startedAt
 */
const getCommitStatuses = async (_, callback) => {
  try {
    const clientPayload = getClientPayloadParsed();
    const { githubToken, headSha: commit_sha, owner, repo } = clientPayload;

    if (!githubToken || typeof githubToken !== 'string') {
      console.log(`missing githubToken or bad format`);
      return callback(null, '[]');
    }

    const octokit = new Octokit({ auth: githubToken });

    // get commit statuses for the commit
    const { data: commitStatuses } = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{commit_sha}/status',
      {
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
        owner,
        repo,
        commit_sha
      }
    );

    // format the response to match the original checks structure
    const formattedChecks = commitStatuses.statuses.map(status => ({
      name: status.context,
      status: status.state === 'success' ? 'completed' : status.state,
      conclusion: status.state,
      title: status.description,
      completedAt: status.updated_at,
      startedAt: status.created_at
    }));

    return callback(null, JSON.stringify(formattedChecks));
  } catch (error) {
    console.log(error?.message);
    return callback(null, error?.message);
  }
};

module.exports = {
  async: true,
  immediate: true,
  filter: getCommitStatuses
};