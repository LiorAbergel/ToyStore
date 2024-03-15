using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using ToyStore.DAL;

namespace ToyStore.Models
{
    public class Toy
    {
        [Key]
        [Required(ErrorMessage = "Please enter a valid Id.")]
        [Range(1, int.MaxValue)]
        public int ToyId { get; set; }

        [Required(ErrorMessage = "Please enter the name of the toy.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2 - 50 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter the description of the toy.")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "Description must be 10 - 500 characters.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Please enter the price of the toy.")]
        [Range(1, 1000, ErrorMessage = "Price must be between $1 and $1000.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Please enter the age group the toy is suitable for.")]
        [StringLength(10, MinimumLength = 2, ErrorMessage = "Age group must be 2 - 10 characters.")]
        public string AgeGroup { get; set; }

        [Required(ErrorMessage = "Please enter the path to the image file representing the toy.")]
        [StringLength(200, MinimumLength = 10, ErrorMessage = "Image path must be 10 - 200 characters.")]
        public string ImagePath { get; set; }

        [Required(ErrorMessage = "Please enter the category Id.")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public Toy() {}

        //public Toy(string name, string description, decimal price, string ageGroup, string imagePath, int categoryId)
        //{
        //    // Set properties
        //    Name = name;
        //    Description = description;
        //    Price = price;
        //    AgeGroup = ageGroup;
        //    ImagePath = imagePath;
        //    CategoryId = categoryId;

        //    // Perform category logic here
        //    Category = DetermineCategory();
        //}

        // Example method to determine category
        private Category DetermineCategory(int categoryId)
        {
            using (var CategoryDAL = new CategoryDAL())
            {
                var x =  CategoryDAL.Categories.FirstOrDefault(c => c.CategoryId == categoryId);
                return x;
            }
        }
    }
}