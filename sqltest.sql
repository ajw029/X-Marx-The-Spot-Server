INSERT INTO accounts (id, username, password) VALUES(1, "test", "pass");
INSERT INTO folders (id, account_id, name) VALUES(1, "default_folder", id);
SELECT * FROM folders;