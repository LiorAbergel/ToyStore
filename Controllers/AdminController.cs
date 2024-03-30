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
    //[Authorize(Roles = "Admin")] - remember to uncomment this line !!!!!!!!!!!!!!
    public class AdminController : BaseController
    {
        private readonly ToyDAL _toyDAL;
        private readonly ToyViewModel _toyViewModel;

        public AdminController()
        {
            _toyDAL = new ToyDAL();
            _toyViewModel = new ToyViewModel
            {
                Toy = new Toy(),
                ToyList = _toyDAL.GetToys()
            };
        }

        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Toys()
        {
            return View(_toyViewModel);
        }
        public ActionResult Categories()
        {
            return View();
        }
        public ActionResult Customers()
        {
            return View();
        }
        public ActionResult Orders()
        {
            return View();
        }
    }
}