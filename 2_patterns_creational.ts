import inquirer from 'inquirer';

type RequirementDescription = {
    code: string
    description: string
}

class RequirementsDocument {
    author?: string
    name?: string
    project?: string
    requirements?: RequirementDescription[]

    print() {
        console.log(`Document:${this.author}`)
        console.log(`Name:${this.name}`)
        console.log(`Project:${this.project}`)
        console.log("Requirements:")
        console.table(this.requirements)
    }
}

class RequirementsDocumentBuilder {
    author?: string
    name?: string
    project?: string
    requirements?: RequirementDescription[]

    static instance = new RequirementsDocumentBuilder();

    private constructor() {
    }

    static getInstance(): RequirementsDocumentBuilder {
        return RequirementsDocumentBuilder.instance;
    }

    setAuthor(author: string): RequirementsDocumentBuilder {
        this.author = author;
        return this;
    }

    setName(name: string): RequirementsDocumentBuilder {
        this.name = name;
        return this;
    }

    setProject(project: string): RequirementsDocumentBuilder {
        this.project = project;
        return this;
    }

    setRequirements(requirements: RequirementDescription[]): RequirementsDocumentBuilder {
        this.requirements = requirements;
        return this;
    }

    build(): RequirementsDocument {
        const result = new RequirementsDocument();
        result.author = this.author;
        result.name = this.name;
        result.project = this.project;
        result.requirements = this.requirements;
        return result;
    }


}

/** Exercise **/
/** Use a creational pattern to create an instance of RequirementsDocument **/
/** Example: Factory, Builder or Singleton **/
class CommandLineInterface {
    private builder: RequirementsDocumentBuilder;
    private requirements: RequirementDescription[]

    constructor(builder: RequirementsDocumentBuilder) {
        this.builder = builder;
        this.requirements = [];
    }

    private createDocument() {
        this.builder.setRequirements(this.requirements);
        const doc = this.builder.build();
        doc.print();
    }

    private async addAuthor() {
        const inq = await inquirer.prompt([
            {
                type: "text",
                name: "author",
                message: "Document Author?"
            }
        ]);

        console.log("My document's author name is: ", inq.author);
        this.builder.setAuthor(inq.author);
    }

    private async addName() {
        const inq = await inquirer.prompt([
            {
                type: "text",
                name: "name",
                message: "Document name?"
            }
        ]);

        console.log("My document's name is: ", inq.name);
        this.builder.setName(inq.name);
    }

    private async addProject() {
        const inq = await inquirer.prompt([
            {
                type: "text",
                name: "project",
                message: "Project name?"
            }
        ]);

        console.log("My document's project name is: '", inq.project, "'");
        this.builder.setProject(inq.project);
    }

    private async addRequirements() {
        const inq = await inquirer.prompt([
            {
                type: "text",
                name: "code",
                message: "Code number?"
            },
            {
                type: "text",
                name: "description",
                message: "Write a description"
            }
        ]);

        const req: RequirementDescription = {
            code: inq.code,
            description: inq.description
        };

        this.requirements.push(req);
        console.log("Requirement added!");
    }


    async main() {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Add Author', 'Add Name', 'Add Project', 'Add Requirements', 'Create', 'Exit'],
            }
        ]);

        switch (answers.action) {
            case 'Add Author':
                await this.addAuthor();
                await this.main()
                break;
            case 'Add Name':
                await this.addName();
                await this.main()
                break;
            case 'Add Project':
                await this.addProject();
                await this.main()
                break;
            case 'Add Requirements':
                await this.addRequirements();
                await this.main()
                break;
            case 'Create':
                // Create new RequirementsDocument Object
                // Execute requirementsDocument.print() to get the final output
                this.createDocument();
                return;
            case 'Exit':
                return;
        }
    }
}

const cli = new CommandLineInterface(RequirementsDocumentBuilder.getInstance())
cli.main()