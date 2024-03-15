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
        public HomeController() { _toyDAL = new ToyDAL(); } // Inject ToyContext dependency

        public ActionResult Index()
        {
            // Retrieve all toys from the database
            var toys = _toyDAL.Toys.ToList();

            ToyViewModel toyViewModel = new ToyViewModel
            {
                Toy = new Toy(),
                ToyList = toys
            };

            return View(toyViewModel); // Pass data to the View
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
    }
}