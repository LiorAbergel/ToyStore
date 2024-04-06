using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToyStore.Models;
using ToyStore.DAL;
using ToyStore.ViewModel;
using System.Web.UI;

namespace ToyStore.Controllers
{
    public class ToyController : BaseController
    {
        protected readonly ToyDAL _toyDAL;
        protected readonly CategoryDAL _categoryDAL;
        protected readonly ToyViewModel _toyViewModel;
        public ToyController()  
        {
            _toyDAL = new ToyDAL();
            _categoryDAL = new CategoryDAL();
            _toyViewModel = new ToyViewModel
            {
                Toy = new Toy(),
                ToyList = _toyDAL.Toys.ToList(),
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

        public ActionResult Gallery(string searchText)
        {
            // if search text is not null, then search for the toy
            if (searchText != null)
            {
                List<Toy> toyList = _toyDAL.SearchToy(searchText);
                ToyViewModel tvm = new ToyViewModel()
                {
                    Toy = new Toy(),
                    ToyList = toyList,
                    CategoryList = _categoryDAL.Categories.ToList(),
                    AgeGroupList = new List<string>()
                };

                foreach (Toy toy in tvm.ToyList)
                {
                    if (!tvm.AgeGroupList.Contains(toy.AgeGroup))
                    {
                        tvm.AgeGroupList.Add(toy.AgeGroup);
                    }
                }

                ViewBag.SearchValue = searchText; // Pass the search value using ViewBag

                return View(tvm);
            }

            else
            {
                return View(_toyViewModel);
            }
        }


    }
}