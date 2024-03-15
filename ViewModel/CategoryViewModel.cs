using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.ViewModel
{
    public class CategoryViewModel
    {
        public Category Category { get; set; }
        public List<Category> CategoryList { get; set; }
    }
}