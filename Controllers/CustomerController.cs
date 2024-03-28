using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ToyStore.Models;
using ToyStore.DAL;
using ToyStore.ViewModel;


namespace ToyStore.Controllers
{
    public class CustomerController : BaseController
    {
        private readonly CustomerDAL _customerDAL;
        private readonly CustomerViewModel _customerViewModel;
        // GET: Customer

        public CustomerController()
        {
            _customerDAL = new CustomerDAL();
            _customerViewModel = new CustomerViewModel
            {
                Customer = new Customer(),
                CustomerList = _customerDAL.Customers.ToList()
            };
        }
        public ActionResult Register()
        {
            _customerViewModel.Customer = new Customer();
            return View(_customerViewModel);
        }

        [HttpPost]
        public ActionResult SubmitRegister(CustomerViewModel model)
        {
            if (ModelState.IsValid)
            {
                // Add the customer to the database
                _customerDAL.Add(model.Customer);

                // Redirect the user to the login page
                return RedirectToAction("LogIn");
            }

            // If the model state is not valid, return the user to the registration page
            return View("Register", model);
        }
        public ActionResult LogIn()
        {
            _customerViewModel.Customer = new Customer();
            return View(_customerViewModel); ;
        }

        [HttpPost]
        public ActionResult SubmitLogIn(CustomerViewModel model)
        {
            // Remove validation errors for properties you want to skip validation
            ModelState.Remove("FirstName");
            ModelState.Remove("LastName");
            ModelState.Remove("Address");

            if (ModelState.IsValidField("Email") && ModelState.IsValidField("Password"))
            {
                // Check if the customer exists in the database
                Customer customer = _customerDAL.Customers.FirstOrDefault
                    (c => c.Email == model.Customer.Email && c.Password == model.Customer.Password);

                if (customer != null)
                {
                    // If the customer exists, store the customer in the session and redirect to the home page
                    Session["Customer"] = customer;
                    Session["IsLoggedIn"] = "true";
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    // If the customer does not exist, add a model error
                    ModelState.AddModelError("", "Invalid email or password.");
                }
            }

            // If the model state is not valid or the customer does not exist, return the user to the login page
            return View("LogIn", model);
        }

        public ActionResult LogOut()
        {
            Session.Remove("Customer");
            Session.Remove("IsLoggedIn");
            return RedirectToAction("Index", "Home");
        }

            //public ActionResult Load()
            //{
            //    Customer mcust = new Customer
            //    {
            //        FirstName = " ",
            //        LastName = " ",
            //        CustomerId = " "
            //    };

            //    return View("Customer", mcust);
            //}

            //public ActionResult Enter()
            //{

            //    CustomerDAL dal = new CustomerDAL();
            //    CustomerViewModel cvm = new CustomerViewModel();
            //    List<Customer> customers = dal.Customers.ToList();
            //    cvm.Customer = new Customer();
            //    cvm.CustomerList = customers;
            //    return View(cvm);
            //}

            //[HttpPost]
            //public ActionResult Submit()
            //{
            //    CustomerViewModel cvm = new CustomerViewModel();
            //    Customer myCustomer = new Customer()
            //    {
            //        FirstName = Request.Form["customer.FirstName"].ToString(),
            //        LastName = Request.Form["customer.LastName"].ToString(),
            //        Email = Request.Form["customer.Email"].ToString(),
            //        Address = Request.Form["customer.Address"].ToString()
            //    };
            //    CustomerDAL dal = new CustomerDAL();
            //    if (ModelState.IsValid)
            //    {
            //        dal.Customers.Add(myCustomer);
            //        dal.SaveChanges();
            //        cvm.Customer = new Customer();
            //    }
            //    else
            //        cvm.Customer = myCustomer;

            //    cvm.CustomerList = dal.Customers.ToList();

            //    return View("Enter", cvm);
            //}

            //public ActionResult ShowSearch()
            //{
            //    CustomerViewModel cvm = new CustomerViewModel();
            //    cvm.CustomerList = new List<Customer>();

            //    return View("SearchCustomer", cvm);
            //}

            //public ActionResult SearchCustomer()
            //{
            //    CustomerDAL dal = new CustomerDAL();
            //    string searchValue = Request.Form["txtFirstName"].ToString();
            //    List<Customer> customers = (from x in dal.Customers where x.FirstName.Contains(searchValue) select x).ToList<Customer>();
            //    CustomerViewModel cvm = new CustomerViewModel();
            //    cvm.CustomerList = customers;

            //    return View("SearchCustomer", cvm);
            //}





        }
}