using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToyStore.DAL;

namespace ToyStore.Controllers
{
    public class BaseController : Controller
    {
        public CategoryDAL CategoryDAL { get; set; }
        public ToyDAL ToyDAL { get; set; }

        public BaseController()
        {
            CategoryDAL = new CategoryDAL();
            ToyDAL = new ToyDAL();
            ViewData["HeaderCategories"] = CategoryDAL.Categories.ToList();
        }
    }
}