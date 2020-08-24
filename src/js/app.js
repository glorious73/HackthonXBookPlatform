import AccountService from './service/AccountService';
import FetchService from './service/FetchService';
import BookService from './service/BookService';
import OrderService from './service/OrderService';

/*-- Objects --*/
const fetchService = new FetchService();
const accountService = new AccountService(fetchService);
const bookService = new BookService(fetchService, accountService);
const orderService = new OrderService(fetchService, accountService);
/*-- /Objects --*/

/*-- Functions --*/
// Signup
function signUp(e, form) {
    e.preventDefault();
    accountService.signUp(form);
}
// Login
function login(e, form) {
    e.preventDefault();
    accountService.login(form);
}
function logout(e) {
    e.preventDefault();
    accountService.logout();
}
// Add book
function addBook(e, form) {
    e.preventDefault();
    bookService.addBook(form);
}
// Load books
async function loadBooks(booksSection) {
    await bookService.loadBooks(booksSection);
}
// place order
async function addOrder(bookId) {
    const book = await bookService.getBookById(bookId);
    orderService.addOrder(book);
}
/*-- /Functions --*/


/*-- Event Listeners --*/
// Navbar
const signupNav = document.querySelector('#signupNav');
const loginNav = document.querySelector('#loginNav');
const logoutNav = document.querySelector('#logoutNav');
const addBookNav = document.querySelector('#addbookNav');
if(signupNav) {
    const user = accountService.getUserFromLocalStorage();
    if(user) {
        console.log(`logged in`);
        signupNav.style.display = 'none';
        loginNav.style.display = 'none';
        logoutNav.style.display = 'initial';
        addBookNav.style.display = 'initial';
    } else {
        console.log(`logged out`);
        signupNav.style.display = 'initial';
        loginNav.style.display = 'initial';
        logoutNav.style.display = 'none';
        addBookNav.style.display = 'none';
    }
}



// Sign up
const signUpForm = document.querySelector("#signUpForm");
if(signUpForm) {
    signUpForm.addEventListener("submit", function(e) {
        signUp(e, this);
    });
}
// Login
const loginForm = document.querySelector("#loginForm");
if(loginForm) {
    loginForm.addEventListener("submit", function(e) {
        login(e, this);
    });
}

// logout
const logoutButton = document.querySelector('#logoutNav');
if(logoutButton) {
    logoutButton.addEventListener('click', function(e) {
        logout(e);
    });
}
// Add book Form
const addBookForm = document.querySelector("#addBookForm");
if(addBookForm) {
    addBookForm.addEventListener("submit", function(e) {
        addBook(e, this);
    });
}
// Load books
const booksSection = document.querySelector("#booksSection");
if(booksSection) {
    loadBooks(booksSection).then(async function() {
        const buttons = document.querySelectorAll(".btn-order");
        if(buttons) {
            if(buttons.length > 0) {
                for(const button of buttons) {
                    const bookId = button.id.toString().charAt(button.id.toString().length-1);
                    const book = await bookService.getBookById(bookId);
                    console.log(book);
                    if(book.isAvailable) {
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            addOrder(bookId);
                        });
                    }
                    else {
                        button.disabled = true;
                    }
                }
            }
        }
    }).catch(function(err) {
        console.log(err);
    });
}
/*-- /Event Listeners --*/
