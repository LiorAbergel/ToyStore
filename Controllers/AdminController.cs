using System;
using System.Collections.Generic;
using System.Data.Entity;
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

        private readonly CategoryDAL _categoryDAL;

        public AdminController()
        {
            _toyDAL = new ToyDAL();
            _categoryDAL = new CategoryDAL();
            _toyViewModel = new ToyViewModel
            {
                Toy = new Toy(),
                ToyList = _toyDAL.GetToys(),
                CategoryList = _categoryDAL.Categories.ToList(),
                AgeGroupList = new List<string>()
            };

            foreach (Toy toy in _toyViewModel.ToyList)
            {
                if (!_toyViewModel.AgeGroupList.Contains(toy.AgeGroup))
                {
                    _toyViewModel.AgeGroupList.Add(toy.AgeGroup);
                }
            }
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

        [HttpPost]
        public ActionResult EditToy(Toy toy)
        {
            _toyDAL.EditToy(toy);

            // Return a response
            return Json(new { success = true });
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