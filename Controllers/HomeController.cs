using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToyStore.DAL;
using ToyStore.Models;
using ToyStore.ViewModel;

namespace ToyStore.Controllers
{
    public class HomeController : ToyController
    {
        
        public HomeController() {
        
        
        }
        public ActionResult Index()
        {

            return View(_toyViewModel);
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