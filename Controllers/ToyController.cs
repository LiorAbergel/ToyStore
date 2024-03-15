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
    public class ToyController : Controller
    {
        private readonly ToyDAL _toyDAL;
        public ToyController()  { _toyDAL = new ToyDAL(); } // Inject ToyContext dependency

        // GET: Toy
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
    }
}