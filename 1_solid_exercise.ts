import inquirer from 'inquirer';

enum EntityType {
    book,
    user
}

abstract class IEntity {
    public name: string
    public type: EntityType

    constructor(name: string, type: EntityType) {
        this.name = name
        this.type = type
    }

    abstract getDescription(): void
}

class Book extends IEntity {
    public isbn: string

    constructor(name: string, isbn: string) {
        super(name, EntityType.book)
        this.isbn = isbn;
    }

    public getDescription() {
        return `Book with name: "${this.name}" and isbn: "${this.isbn}"`
    }
}

class User extends IEntity {
    public age: number

    constructor(name: string, age: number) {
        super(name, EntityType.user)
        this.age = age
    }

    public getDescription() {
        return `User with name: "${this.name}"`
    }
}

interface EntityManager {
    addEntity(entity: IEntity): IEntity;
    removeEntity(entityName: string): IEntity | undefined;
    getEntity(entityName: string): IEntity | undefined;
    getEntities(): IEntity[];
}

class BookManager implements EntityManager {
    books: IEntity[] = [];

    constructor() {
        this.books = [];
    }

    addEntity(book: IEntity) {
        this.books.push(book);
        return book
    }

    removeEntity(bookName: string) {
        const book = this.getEntity(bookName);
        if (book) {
            this.books = this.books.filter(book => book.name !== bookName);
        }
        return book;
    }

    getEntity(bookName: string) {
        return this.books.find(book => book.name === bookName);
    }

    getEntities() {
        return this.books
    }
}

class UserManager implements EntityManager {
    users: IEntity[];

    constructor() {
        this.users = [];
    }

    addEntity(user: IEntity) {
        this.users.push(user);
        return user
    }

    removeEntity(userName: string) {
        const user = this.getEntity(userName);
        if (user) {
            this.users = this.users.filter(user => user.name !== userName);
        }
        return user;
    }

    getEntity(userName: string) {
        return this.users.find(user => user.name === userName);
    }

    getEntities() {
        return this.users
    }
}

class CommandLineInterface {
    bookManager: EntityManager
    userManager: EntityManager

    constructor(bookManager: EntityManager, userManager: EntityManager) {
        this.bookManager = bookManager;
        this.userManager = userManager;
    }

    list(manager: EntityManager) {
        console.table(manager.getEntities())
    }

    async get(manager: EntityManager) {
        const entity = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'Enter the entity name:'
            }
        ])

        const result = manager.getEntity(entity.name)

        if (result) {
            console.log(result.getDescription())
        } else {
            console.log("Entity not found")
        }
    }

    async remove(manager: EntityManager) {
        const entity = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'Book Name?'
            }
        ])

        const result = manager.removeEntity(entity.name)

        if (result) {
            console.log(result.getDescription() + "removed!")
        } else {
            console.log("Entity not found")
        }
    }

    // SPECIFIC FUNCTIONALITY

    async addBook() {
        const bookData = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'Book Name?',
            },
            {
                type: 'text',
                name: 'isbn',
                message: 'Book ISBN?',
            }
        ]);

        const newBook = this.bookManager.addEntity(new Book(bookData.name, bookData.isbn))
        console.log(`Added ${newBook.getDescription()}"`)
    }

    async addUser() {
        const userData = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'User Name?',
            },
            {
                type: 'text',
                name: 'age',
                message: 'User Age?',
            }
        ]);

        const newUser = this.userManager.addEntity(new User(userData.name, userData.age))
        console.log(`Added ${newUser.getDescription()}"`)
    }

    // MAIN FUNCTIONALITY

    async main() {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Add Book', 'List Books', 'Remove Book', 'Add User', 'List Users', 'Remove User', 'Get User', 'Get Book', 'Exit'],
            }
        ]);

        switch (answers.action) {
            case 'Add Book':
                await this.addBook()
                this.main()
                break;
            case 'List Books':
                this.list(this.bookManager);
                this.main()
                break;
            case 'Remove Book':
                await this.remove(this.bookManager);
                this.main()
                break;
            case 'Get Book':
                await this.get(this.bookManager);
                this.main()
                break;

            case 'Add User':
                await this.addUser()
                this.main()
                break;
            case 'Remove User':
                await this.remove(this.userManager);
                this.main()
                break;
            case 'List Users':
                this.list(this.userManager);
                this.main()
                break
            case 'Get User':
                await this.get(this.userManager);
                this.main()
                break;
            case 'Exit':
                return;
        }
    }
}


const cli = new CommandLineInterface(new BookManager(), new UserManager())
cli.main()
