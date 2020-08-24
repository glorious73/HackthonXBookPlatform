export default class BookService {
    constructor(fetchService, accountService) {
        this.fetchService = fetchService;
        this.accountService = accountService;
        this.baseUrl   = "https://hackathonxbookplatform.herokuapp.com";
        this.addBookPath = "/api/Book";
        this.loadBooksPath = "/api/Book";
        this.getBookPath = "/api/Book";
    }

    async addBook(form) {
        // Get form data in json format
        const jsonFormData = this.buildJsonFormData(form);
        // build headers
        const user = JSON.parse(this.accountService.getUserFromLocalStorage());
        const token = user.user.token;
        const headers = this.buildHeaders(`Bearer ${token}`);
        // Request
        const response = await this.fetchService.performPostHttpRequest(`${this.baseUrl}${this.addBookPath}`, headers, jsonFormData);
        if(response.success) {
            window.location = "/index.html";
        }
        else
            alert(`An error occured: ${response.result}`);
    }

    async getBookById(id) {
        const headers = this.buildHeaders();
        const response = await this.fetchService.performGetHttpRequest(`${this.baseUrl}${this.getBookPath}/${id}`, headers);
        if(response.success) {
            return response.result;
        } 
        return null;
    }

    async getBooks() {
        const headers = this.buildHeaders();
        const response = await this.fetchService.performGetHttpRequest(`${this.baseUrl}${this.loadBooksPath}`, headers);
        if(response.success) {
            return response.result;
        } 
        return null;
    }

    async loadBooks(booksSection) {
        console.log(`loading books.`);
        // get books
        const books = await this.getBooks();
        if(!books) {
            alert(`Couldn't load books. ${response.result}`);
            return;
        }
        // load them book by book
        for(const book of books) {
            // grab book template
            let template = document.getElementById('bookTemplate');
            let fragment = document.importNode(template.content, true);
            this.fillBookData(fragment, book);
            booksSection.appendChild(fragment);
        }
        return books;
    }

    fillBookData(bookTemplate, book) {
        console.log(JSON.stringify(book));
        // Title
        bookTemplate.querySelector("#bookTitle").innerHTML = book.title;
        // Author
        bookTemplate.querySelector('#bookAuthor').innerHTML = book.author;
        // Category
        bookTemplate.querySelector('#bookCategory').innerHTML = book.category.value;
        // ISBN
        bookTemplate.querySelector('#bookIsbn').innerHTML = book.isbn;
        // Description
        bookTemplate.querySelector('#bookDesc').innerHTML = book.description;
        // Pages
        bookTemplate.querySelector('#bookPages').innerHTML = book.pages;
        // Availability
        bookTemplate.querySelector('#bookAvailability').innerHTML = (book.isAvailable) ? "Available" : "Not available";
        // User
        bookTemplate.querySelector('#bookUser').innerHTML = book.user.firstName + " " + book.user.lastName;
        // Order
        bookTemplate.querySelector('#orderButton').id = `orderButton${book.id}`;
    }

    buildHeaders(authorization = null) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": (authorization) ? authorization : "Bearer ",
        };
        return headers;
    }

    buildJsonFormData(form) {
        const jsonFormData = { };
        for(const pair of new FormData(form)) {
            jsonFormData[pair[0]] = pair[1];
        }
        return jsonFormData;
    }
}