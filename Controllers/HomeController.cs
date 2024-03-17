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
    public class HomeController : Controller
    {
        private readonly ToyDAL _toyDAL;
        private readonly ToyViewModel _toyViewModel;
        public HomeController()
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
            return View(_toyViewModel); // Pass data to the View
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Search()
        {
            string searchValue = Request.Form["searchText"].ToString().ToLower();

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