using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.ViewModel
{
    public class OrderItemViewModel
    {
        public OrderItem OrderItem { get; set; }
        public List<OrderItem> OrderItemList { get; set; }
    }
}