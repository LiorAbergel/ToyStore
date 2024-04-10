using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToyStore.DAL;
using ToyStore.Models;
using ToyStore.ViewModel;

namespace ToyStore.Controllers
{
    public class OrderController : BaseController
    {
        private readonly OrderDAL _orderDAL;
        private readonly OrderViewModel _orderViewModel;

        private readonly OrderItemDAL _orderItemDAL;
        private readonly OrderItemViewModel _orderItemViewModel;

        private readonly ToyDAL _toyDAL;

        private readonly CustomerDAL _customerDAL;

        public OrderController()
        {
            _orderDAL = new OrderDAL();
            _orderViewModel = new OrderViewModel
            {
                Order = new Order(),
                OrderList = _orderDAL.Orders.ToList()
            };

            _orderItemDAL = new OrderItemDAL();
            _orderItemViewModel = new OrderItemViewModel
            {
                OrderItem = new OrderItem(),
                OrderItemList = _orderItemDAL.OrderItems.ToList()
            };

            _toyDAL = new ToyDAL();
            _customerDAL = new CustomerDAL();
        }

        public ActionResult SubmitOrder(Customer customer)
        {
            // Check if there are any products in the cart
            if (Session["Orders"] == null)
                return Json(new { success = false, message = "No products found in cart !" });

            // Get the products from the cart
            List<OrderItem> orderItems = (List<OrderItem>)Session["Orders"];

            // Check if the customer is logged in
            if (Session["IsLoggedIn"] == null)
            {
                // Check if the customer is already registered
                Customer existingCustomer = _customerDAL.Customers.FirstOrDefault(x => x.Email == customer.Email);
                if (existingCustomer == null)
                {
                    // Register the customer
                    _customerDAL.Add(customer);

                    // Set the customer id in the session
                    Session["CustomerId"] = customer.CustomerId;
                }
                else
                {
                    // Set the customer id in the session
                    Session["CustomerId"] = existingCustomer.CustomerId;
                }
                
            }
                
            // Get the customer id from the session
            int customerId = (int)Session["CustomerId"];

            // Create a new order
            Order order = new Order
            {
                CustomerId = customerId,
                OrderDate = DateTime.Now,
            };

            // Add the order to the database
            _orderDAL.Add(order);

            // Add the order items to the database
            foreach (OrderItem orderItem in orderItems)
            {
                // Set the order id
                orderItem.OrderId = order.OrderId;

                // Update the toy stock
                Toy toy = _toyDAL.GetToyById(orderItem.ToyId);
                toy.Amount -= orderItem.Quantity;
                _toyDAL.EditToy(toy);

                // Add the order item to the database
                _orderItemDAL.Add(orderItem);
            }

            // Clear the cart
            Session["Orders"] = null;

            // Return success message
            return Json(new { success = true, message = "Order submitted successfully !" });
        }

        // GET: Order
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult TrackOrder()
        {

            return View(_orderItemViewModel);
        }

        //public ActionResult Search()
        //{
        //    int customerId = ((Customer)Session["Customer"]).CustomerId;

        //    List<Order> OrderList = _orderDAL.Orders.Where(x => x.CustomerId == customerId).ToList();
        //    List<OrderItem> OrderItemList = new List<OrderItem>();

        //    foreach (Order order in OrderList)
        //        OrderItemList.AddRange(_orderItemDAL.OrderItems.Where(x => x.OrderId == order.OrderId).ToList());

        //    OrderViewModel orderViewModel = new OrderViewModel 
        //    {
        //        OrderList = OrderList,
        //        OrderItemList = OrderItemList
        //    };

        //    return View("Search", orderViewModel);
        //}

        public ActionResult Cart()
        {
            return View(_orderViewModel);
        }
    }
}