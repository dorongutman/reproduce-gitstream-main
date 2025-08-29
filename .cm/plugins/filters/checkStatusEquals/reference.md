<a name="module_checkStatusEquals"></a>

## checkStatusEquals
Check whether a given commit hash (or branch name) contains a status check with a given state

**Returns**: <code>boolean</code> - Returns true if the status check equals the given value
**License**: MIT  

| Param         | Type                | Description                                                  |
| ------------- | ------------------- | ------------------------------------------------------------ |
| input         | <code>string</code> | The SHA of the commit or branch to get the check status for. |
| checkName     | <code>string</code> | The name of the check to get the status for                  |
| expectedState | <code>string</code> | The expected state of the check.                             |
| githubOrg     | <code>string</code> | The organization of the repository.                          |
| githubRepo    | <code>string</code> | The name of the repository.                                  |
| token         | <code>string</code> | The GitHub token to use for authentication.                  |

**Example**  
```js
{{ branch.name | checkStatusEquals('my-external-service', 'success', repo.owner, repo.name, env.GITHUB_TOKEN) }}
```