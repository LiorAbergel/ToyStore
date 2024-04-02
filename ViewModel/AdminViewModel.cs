using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.ViewModel
{
    public class AdminViewModel
    {
        public Toy Toy { get; set; }
        public List<Toy> ToyList { get; set; }
        public Category Category { get; set; }
        public List<Category> CategoryList { get; set; }
        public Customer Customer { get; set; }
        public List<Customer> CustomerList { get; set; }
        public Order Order { get; set; }
        public List<Order> OrderList { get; set; }
        public OrderItem OrderItem { get; set; }
        public List<OrderItem> OrderItemList { get; set; }
    }
}