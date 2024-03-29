using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.ViewModel
{
    public class OrderViewModel
    {
        public Order Order { get; set; }
        public List<Order> OrderList { get; set; }
        public OrderItem OrderItem { get; set; }
        public List<OrderItem> OrderItemList { get; set; }

    }
}