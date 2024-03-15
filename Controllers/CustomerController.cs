using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ToyStore.Models;
using ToyStore.DAL;
using ToyStore.ViewModel;


namespace ToyStore.Controllers
{
    public class CustomerController : Controller
    {
        // GET: Customer
        public ActionResult Load()
        {
            Customer mcust = new Customer
            {
                FirstName = " ",
                LastName = " ",
                CustomerId = " "
            };

            return View("Customer", mcust);
        }

        public ActionResult Enter()
        {

            CustomerDAL dal = new CustomerDAL();
            CustomerViewModel cvm = new CustomerViewModel();
            List<Customer> customers = dal.Customer.ToList();
            cvm.Customer = new Customer();
            cvm.CustomerList = customers;
            return View(cvm);
        }

        [HttpPost]
        public ActionResult Submit()
        {
            CustomerViewModel cvm = new CustomerViewModel();
            Customer myCustomer = new Customer()
            {
                FirstName = Request.Form["customer.FirstName"].ToString(),
                LastName = Request.Form["customer.LastName"].ToString(),
                Email = Request.Form["customer.Email"].ToString(),
                Address = Request.Form["customer.Address"].ToString()
            };
            CustomerDAL dal = new CustomerDAL();
            if (ModelState.IsValid)
            {
                dal.Customer.Add(myCustomer);
                dal.SaveChanges();
                cvm.Customer = new Customer();
            }
            else
                cvm.Customer = myCustomer;

            cvm.CustomerList = dal.Customer.ToList();

            return View("Enter", cvm);
        }

        public ActionResult ShowSearch()
        {
            CustomerViewModel cvm = new CustomerViewModel();
            cvm.CustomerList = new List<Customer>();

            return View("SearchCustomer", cvm);
        }

        public ActionResult SearchCustomer()
        {
            CustomerDAL dal = new CustomerDAL();
            string searchValue = Request.Form["txtFirstName"].ToString();
            List<Customer> customers = (from x in dal.Customer where x.FirstName.Contains(searchValue) select x).ToList<Customer>();
            CustomerViewModel cvm = new CustomerViewModel();
            cvm.CustomerList = customers;

            return View("SearchCustomer", cvm);
        }
    }
}