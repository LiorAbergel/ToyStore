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
    public class OrderController : Controller
    {
        private readonly OrderDAL _orderDAL;
        private readonly OrderViewModel _orderViewModel;

        private readonly OrderItemDAL _orderItemDAL;
        private readonly OrderItemViewModel _orderItemViewModel;

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
        }

        // GET: Order
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Search()
        {
            int customerId = ((Customer)Session["Customer"]).CustomerId;

            List<Order> OrderList = _orderDAL.Orders.Where(x => x.CustomerId == customerId).ToList();
            List<OrderItem> OrderItemList = new List<OrderItem>();

            foreach (Order order in OrderList)
                OrderItemList.AddRange(_orderItemDAL.OrderItems.Where(x => x.OrderId == order.OrderId).ToList());

            OrderViewModel orderViewModel = new OrderViewModel 
            {
                OrderList = OrderList,
                OrderItemList = OrderItemList
            };

            return View("Search", orderViewModel);
        }
    }
}