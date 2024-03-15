using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ToyStore.Models
{
    public class Category
    {
        [Key]
        [Required(ErrorMessage = "Please enter a valid Id.")]
        [Range(1, int.MaxValue)]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Please enter the name of the category.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2 - 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter a description of the category.")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be 10 - 1000 characters.")]
        public string Description { get; set; }
    }
}