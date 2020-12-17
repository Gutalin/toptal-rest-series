import {UsersDto} from "../dto/users.model";
import shortid from "shortid";
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

/**
 * NEVER USER THIS CLASS IN REAL LIFE.
 * This class was created to easy it up the explanation of other topics meanwhile writing the articles.
 * For any scenario consider using an ODM/ORM to manage your own database in a better way.
 */
class GenericInMemoryDao {
    private static instance: GenericInMemoryDao;
    users: Array<UsersDto> = [];

    constructor() {
        log('Created new instance of GenericInMemoryDao');
    }

    static getInstance(): GenericInMemoryDao {
        if (!GenericInMemoryDao.instance) {
            GenericInMemoryDao.instance = new GenericInMemoryDao();
        }
        return GenericInMemoryDao.instance;
    }

    async addUser(user: UsersDto) {
        user.id = shortid.generate();
        this.users.push(user);
        return user.id;
    }

    async getUsers() {
        return this.users;
    }

    async getUserById(userId: string) {
        return this.users.find((user: { id: string; }) => user.id === userId);
    }

    async putUserById(user: UsersDto) {
        const objIndex = this.users.findIndex((obj: { id: string; }) => obj.id === user.id);
        this.users.splice(objIndex, 1, user);
        return `${user.id} updated via put`;
    }

    async patchUserById(user: UsersDto) {
        const objIndex = this.users.findIndex((obj: { id: string; }) => obj.id === user.id);
        let currentUser = this.users[objIndex];
        for (let i in user) {
            if (i !== 'id' && i in currentUser  ) {
                // @ts-ignore
                currentUser[i] = user[i];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return `${user.id} patched`;
    }


    async removeUserById(userId: string) {
        const objIndex = this.users.findIndex((obj: { id: string; }) => obj.id === userId);
        this.users.splice(objIndex, 1);
        return `${userId} removed`;
    }

    async getUserByEmail(email: string) {
        const objIndex = this.users.findIndex((obj: { email: string; }) => obj.email === email);
        let currentUser = this.users[objIndex];
        if (currentUser) {
            return currentUser;
        } else {
            return null;
        }
    }
}

export default GenericInMemoryDao.getInstance();