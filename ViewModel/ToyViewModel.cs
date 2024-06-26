﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ToyStore.Models;

namespace ToyStore.ViewModel
{
    public class ToyViewModel
    {
        public Toy Toy { get; set; }
        public List<Toy> ToyList { get; set; }
        public List<Category> CategoryList { get; set; }
        public List<string> AgeGroupList { get; set; }
    }   
}