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

            Toy editedToy = _toyDAL.GetToyById(toy.ToyId); // Assuming you have a method to get a toy by its ID
            editedToy.Category = _categoryDAL.GetCategoryById(editedToy.CategoryId); // Assuming you have a method to get a category by its ID

            // Return a response
            return Json(new { success = true, toy = editedToy });
        }

        [HttpPost]
        public ActionResult AddToy(Toy toy)
        {
            _toyDAL.AddToy(toy);

            Toy addedToy = _toyDAL.GetToyById(toy.ToyId); // Assuming you have a method to get a toy by its ID
            addedToy.Category = _categoryDAL.GetCategoryById(addedToy.CategoryId); // Assuming you have a method to get a category by its ID

            // Return a response
            return Json(new { success = true, toy = addedToy });
        }

        [HttpPost]
        public ActionResult DeleteToy(int id)
        {
            _toyDAL.DeleteToy(id);

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