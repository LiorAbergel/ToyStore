using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ToyStore.Models;
using ToyStore.DAL;
using ToyStore.ViewModel;
using System.Web.UI;
using System.Web.Services.Description;


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
                    Session["CustomerId"] = customer.CustomerId;
                    Session["CustomerFirstName"] = customer.FirstName;
                    Session["CustomerLastName"] = customer.LastName;
                    Session["CustomerEmail"] = customer.Email;
                    Session["CustomerAddress"] = customer.Address;
                    Session["IsLoggedIn"] = "true";
                    Session["Role"] = customer.Role;
                    Session["CustomerName"] = customer.FirstName + " " + customer.LastName;
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

        [HttpPost]
        public ActionResult AddToCart(int toyId, int amount)
        {
            // Retrieve the toy from the database
            Toy toy = ToyDAL.GetToyById(toyId);

            if (toy == null)
                return Json(new { success = false, message = "Toy not found" });

            if (toy.Amount < amount)
                return Json(new { success = false, message = "Not enough stock" });

            // Create a new order item
            OrderItem orderItem = new OrderItem
            {
                ToyId = toyId,
                Toy = toy,
                Quantity = amount
            };

            // Check if the session has an order list
            if (Session["Orders"] == null)
                Session["Orders"] = new List<OrderItem>();

            // Success message
            string message = "Added To Your Cart!\nToy : " + toy.Name + "\nAmount : " + amount;

            // Check if the order item already exists in the session
            foreach (OrderItem item in (List<OrderItem>)Session["Orders"])
            {
                if (item.ToyId == orderItem.ToyId)
                {
                    item.Quantity += orderItem.Quantity;
                    return Json(new { success = true, message });
                }
            }

            // Add the order item to the session
            ((List<OrderItem>)Session["Orders"]).Add(orderItem);

            return Json(new { success = true, message });
        }

        [HttpPost]
        public ActionResult RemoveFromCart(int toyId)
        {
            // Check if the session has an order list
            if (Session["Orders"] == null)
                return Json(new { success = false, message = "No Items in Cart." });

            // Remove the order item from the session
            ((List<OrderItem>)Session["Orders"]).RemoveAll(item => item.ToyId == toyId);

            return Json(new { success = true, message = "Removed From Cart." });
        }

        [HttpPost]
        public ActionResult EditQuantity(int toyId, int quantity)
        {

            // Check if the session has an order list
            if (Session["Orders"] == null)
                return Json(new { success = false, message = "No Items in Cart." });

            // Update the quantity of the order item in the session
            foreach (OrderItem item in (List<OrderItem>)Session["Orders"])
            {
                if (item.ToyId == toyId)
                {
                    item.Quantity = quantity;
                    return Json(new { success = true, message = "Quantity Updated." });
                }
            }

            return Json(new { success = false, message = "Item not found." });
        }

        public ActionResult LogOut()
        {
            Session.Contents.RemoveAll();
            return RedirectToAction("Index", "Home");
        }
    }
}