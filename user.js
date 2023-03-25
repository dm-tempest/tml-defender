import fs from 'fs';
export class User {
    constructor(id, score) {
        this.id = id;
        this.score = score;
    }

    addScore(x) {
        this.score += x;
    }

    removeScore(y) {
        this.score -= y;
    }

    getScore() {
        return this.score
    }
    
}

export class UserList {
    constructor(users = []) {
        this.list = users;
    }
    addUser(user) {
        fs.readFile('./userslist.json', function (err, data) {
            var json = JSON.parse(data)
            json.users.push(user)
            fs.writeFileSync("./userslist.json", JSON.stringify(json))
        })
        this.list.push(user);
    }
    removeUserById(id) {
        this.list.splice(this.list.findIndex((user) => user.id == id), 1);
        fs.readFile('./userslist.json', function (err, data) {
            var json = JSON.parse(data)
            json.users.splice(this.list.findIndex((user) => user.id == id), 1);
            fs.writeFileSync("./userslist.json", JSON.stringify(json))
        })
        return;
    }

    getUserById(id) {
        return this.list.find(user => user.id == id);
    }

    userExistById(id) {
        if (this.list.find(user => user.id == id)) {
            return true
        }
        return false;
    }

}