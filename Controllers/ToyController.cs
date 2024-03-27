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
        private readonly ToyViewModel _toyViewModel;
        public ToyController()  
        {
            _toyDAL = new ToyDAL();
            _toyViewModel = new ToyViewModel
            {
                Toy = new Toy(),
                ToyList = _toyDAL.Toys.ToList()
            };
        }

        public ActionResult Index()
        {
            return View(_toyViewModel);
        }

        public ActionResult Search(string categoryName)
        {
            string searchValue;
            if (categoryName == null) { searchValue = Request.Form["searchText"].ToString().ToLower(); }
            else { searchValue = categoryName; }


            List<Toy> toyList = _toyDAL.Toys.Where(x => x.Name.Contains(searchValue)).ToList();
            toyList.AddRange(_toyDAL.Toys.Where(x => x.Category.Name.Contains(searchValue)).ToList());
            toyList.AddRange(_toyDAL.Toys.Where(x => x.Description.Contains(searchValue)).ToList());

            ToyViewModel tvm = new ToyViewModel
            {
                ToyList = toyList
            };

            ViewBag.SearchValue = searchValue; // Pass the search value using ViewBag

            return View("Search", tvm);
        }

        public ActionResult Gallery()
        {
            return View(_toyViewModel);
        }


    }
}