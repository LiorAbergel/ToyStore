using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.ViewModel
{
    public class CustomerViewModel
    {
        public Customer Customer { get; set; }
        public List<Customer> CustomerList { get; set; }
    }
}