# Environment Variables

Do not forget to add the following file to use env variables in development mode.

"./local.setting.json"

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing"
    // ...
  }
}
```
