using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
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
            try
            {
                _toyDAL.EditToy(toy);
                Toy editedToy = _toyDAL.GetToyById(toy.ToyId); // Assuming you have a method to get a toy by its ID
                editedToy.Category = _categoryDAL.GetCategoryById(editedToy.CategoryId); // Assuming you have a method to get a category by its ID

                // Return a response
                return Json(new { success = true, toy = editedToy, message = "Toy edited successfully" });
            }
            catch (DbEntityValidationException e)
            {
                string message = e.EntityValidationErrors.First().ValidationErrors.First().ErrorMessage;
                return Json(new { success = false, message });
            }
        }


        [HttpPost]
        public ActionResult AddToy(Toy toy)
        {
            try
            {
                _toyDAL.AddToy(toy);
                Toy editedToy = _toyDAL.GetToyById(toy.ToyId); // Assuming you have a method to get a toy by its ID
                editedToy.Category = _categoryDAL.GetCategoryById(editedToy.CategoryId); // Assuming you have a method to get a category by its ID

                // Return a response
                return Json(new { success = true, toy = editedToy, message = "Toy edited successfully" });
            }
            catch (DbEntityValidationException e)
            {
                string message = e.EntityValidationErrors.First().ValidationErrors.First().ErrorMessage;
                return Json(new { success = false, message });
            }
        }

        [HttpPost]
        public ActionResult DeleteToy(int id)
        {
            // check if toy is in current order
            foreach (OrderItem order in _orderItemDAL.OrderItems)
            {
                if (order.ToyId == id)
                {
                    return Json(new { success = false, message = "Can't delete toy as it's currently in order" });
                }
            }

            // Delete the toy
            _toyDAL.DeleteToy(id);

            // Return a response
            return Json(new { success = true, message = "Toy deleted successfully !" });
        }

        [HttpPost]
        public ActionResult AddCategory(Category category)
        {
            try
            {
                _categoryDAL.AddCategory(category);
                Category addedCategory = _categoryDAL.GetCategoryById(category.CategoryId);
                return Json(new { success = true, category = addedCategory });
            }

            catch (DbEntityValidationException e)
            {
                string message = e.EntityValidationErrors.First().ValidationErrors.First().ErrorMessage;
                return Json(new { success = false, message });
            }
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