using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToyStore.Models;
using ToyStore.DAL;
using ToyStore.ViewModel;

namespace ToyStore.Controllers
{
    public class ToyController : BaseController
    {
        private readonly ToyDAL _toyDAL;
        private readonly CategoryDAL _categoryDAL;
        private readonly ToyViewModel _toyViewModel;
        public ToyController()  
        {
            _toyDAL = new ToyDAL();
            _categoryDAL = new CategoryDAL();
            _toyViewModel = new ToyViewModel
            {
                Toy = new Toy(),
                ToyList = _toyDAL.Toys.ToList(),
                CategoryList = _categoryDAL.Categories.ToList()
            };
        }

        public ActionResult Search(string searchText)
        {
            List<Toy> toyList = _toyDAL.SearchToy(searchText);

            ToyViewModel tvm = new ToyViewModel {ToyList = toyList};

            ViewBag.SearchValue = searchText; // Pass the search value using ViewBag

            return View("Search", tvm);
        }

        public ActionResult Gallery()
        {
            return View(_toyViewModel);
        }


    }
}