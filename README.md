# pwa2021
Programming Web Application, winter semester of 2021/22


## Getting started with code

Go to the selected location of your computer and enter the command:
```
git clone https://gitlab.com/mariusz.jarocki/pwa2021.git
```
It should create a pwa2021 folder. Open it using Visual Studio Code.

* To download the latest version of the project, use Source Control ... Pull in VS Code. Please remember about discarding your changes to avoid conflicts.
* To switch to working branches, click on the branch name in the bottom-left corner of VS Code window and select a branch by your laboratory group number.

## Execution environment

* If you haven't done so yet, install required modules by:
```
npm install
```
Please remember you have to enter the command also in the frontend folder (from the moment it needs support of external code, e.g., Bootstrap or AngularJS).
* The command
```
npm start
```
starts a backend (server) of our project. To stop it, press Ctrl+C (and maybe type Y and enter to confirm).

## Basic project (for grade 3 so satisfactory)

* Create new collection in database: groups. It includes objects consisting in only one field - name (except of automatically created _id)

* All objects in persons collection can by equipped with extra field: group_id. It defines what group the user belongs to. The value of the field is ObjectId, not name of the group.

* Build a page and corresponding controller, connected to the menu position "Groups" - available only for admin role. On the page we can create a group, modify name of existing one and delete a group.

* On the persons view, you should display the name of group the user belongs to. It should be also possible to set membership of any user (it is the hardest part of the project).
