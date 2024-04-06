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
    public class AdminController : ToyController
    {
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

        [HttpPost]
        public ActionResult AddCategory(Category category)
        {
            _categoryDAL.AddCategory(category);

            Category addedCategory = _categoryDAL.GetCategoryById(category.CategoryId); // Assuming you have a method to get a category by its ID

            // Return a response
            return Json(new { success = true, category = addedCategory });
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