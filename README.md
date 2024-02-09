### Basic Transfer
1.  *First clone project and install dependencies*
2.  *Make sure local express server for mssql installed and running*
3.  *Make sure tools for dotnet tools installed and build project*
```bash
dotnet build
```
4.  *Update database*
```bash
dotnet ef database update --project .\Core\ --startup-project .\api\
```
5.  *Locate to web project and run*
```bash
npm run dev
```
6.  *Run api project*
```bash
dotnet run --project .\api\
```
7. *Seed database for roles from api/Auth/seed-roles endpoint*
  
